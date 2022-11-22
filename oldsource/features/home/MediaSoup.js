import {MediaStream, mediaDevices, registerGlobals} from 'react-native-webrtc';
import * as mediasoupClient from 'mediasoup-client';
registerGlobals();

export const getLocalStream = async ({
  setLocalStream,
  params,
  setDevice,
  setConsumerTransport,
  setRemoteStream,
  socket,
  roomID,
}) => {
  const local = await mediaDevices.getUserMedia({
    audio: true,
    video: {
      frameRate: 30,
      facingMode: 'user',
    },
  });
  setLocalStream(local);
  const track = local.getVideoTracks()[0];
  let tmp = {
    track,
    ...params,
  };

  let audioParams = {track: local.getAudioTracks()[0]};

  joinRoom({
    setDevice,
    params: tmp,
    setConsumerTransport,
    setRemoteStream,
    audioParams,
    socket,
    roomID,
  });
};

const joinRoom = ({
  setDevice,
  params,
  setConsumerTransport,
  setRemoteStream,
  audioParams,
  socket,
  roomID,
}) => {
  socket.emit('joinRoom', {roomName: roomID}, data => {
    createDevice({
      setDevice,
      rtpCapabilities: data.rtpCapabilities,
      params,
      setConsumerTransport,
      setRemoteStream,
      audioParams,
      socket,
      roomID,
    });
  });
};

const createDevice = async ({
  setDevice,
  rtpCapabilities,
  params,
  setConsumerTransport,
  setRemoteStream,
  audioParams,
  socket,
}) => {
  try {
    const device = new mediasoupClient.Device();

    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    setDevice(() => device);
    createSendTransport({
      device,
      passedparam: params,

      setRemoteStream,
      setConsumerTransport,
      audioParams,
      socket,
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'UnsupportedError')
      console.warn('browser not supported');
  }
};

const createSendTransport = ({
  device,
  passedparam,
  setConsumerTransport,
  setRemoteStream,
  audioParams,
  socket,
}) => {
  socket.emit('createWebRtcTransport', {consumer: false}, ({params}) => {
    if (params.error) {
      console.log(params.error);
      return;
    }
    let producerTransport = device.createSendTransport(params);
    producerTransport.on(
      'connect',
      async ({dtlsParameters}, callback, errback) => {
        try {
          await socket.emit('transport-connect', {
            dtlsParameters,
          });

          callback();
        } catch (error) {
          errback(error);
        }
      },
    );

    producerTransport.on('produce', async (parameters, callback, errback) => {
      try {
        await socket.emit(
          'transport-produce',
          {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          },
          ({id, producersExist}) => {
            callback({id});
            if (producersExist) {
              getProducers({
                device,
                setConsumerTransport,
                setRemoteStream,
                socket,
              });
            }
          },
        );
      } catch (error) {
        errback(error);
      }
    });

    connectSendTransport({params: passedparam, producerTransport, audioParams});
  });
};

const getProducers = ({
  device,
  setConsumerTransport,
  setRemoteStream,
  socket,
}) => {
  socket.emit('getProducers', producerIds => {
    console.log('producers gotten', producerIds);

    producerIds.forEach(({socketId, producerId}) =>
      signalNewConsumerTransport({
        remoteProducerId: producerId,
        device,
        setRemoteStream,
        setConsumerTransport,
        socket,
        socketId,
      }),
    );
  });
};

const connectSendTransport = async ({
  params,
  producerTransport,
  audioParams,
}) => {
  let producer = await producerTransport.produce(params);
  let audioProducer = await producerTransport.produce(audioParams);
  producer.on('trackended', () => {
    console.log('track ended');
  });

  producer.on('transportclose', () => {
    console.log('transport ended');
  });

  audioProducer.on('trackended', () => {
    console.log('audio track ended');
  });

  audioProducer.on('transportclose', () => {
    console.log('audio transport ended');
  });
};

export const signalNewConsumerTransport = async ({
  device,
  setConsumerTransport,
  setRemoteStream,
  remoteProducerId,
  socket,
  socketId,
}) => {
  await socket.emit('createWebRtcTransport', {consumer: true}, ({params}) => {
    if (params.error) {
      console.log(params.error);
      return;
    }

    // creates a new WebRTC Transport to receive media
    // based on server's consumer transport params
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-createRecvTransport
    let consumerTransport = device.createRecvTransport(params);
    // setConsumerTransport(consumerTransport);
    // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
    // this event is raised when a first call to transport.produce() is made
    // see connectRecvTransport() below
    consumerTransport.on(
      'connect',
      async ({dtlsParameters}, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-recv-connect', ...)
          await socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });

          // Tell the transport that parameters were transmitted.
          callback();
        } catch (error) {
          // Tell the transport that something was wrong
          errback(error);
        }
      },
    );
    connectRecvTransport({
      consumerTransport,
      device,

      setRemoteStream,
      remoteProducerId,
      serverConsumerTransportId: params.id,
      setConsumerTransport,
      socket,
      socketId,
    });
  });
};

const connectRecvTransport = async ({
  device,
  setConsumerTransport,
  consumerTransport,
  setRemoteStream,
  remoteProducerId,
  serverConsumerTransportId,
  socket,
  socketId,
}) => {
  await socket.emit(
    'consume',
    {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    },
    async ({params}) => {
      if (params.error) {
        console.log('Cannot Consume');
        return;
      }
      let consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      setConsumerTransport(prev => [
        ...prev,
        {
          consumerTransport,
          serverConsumerTransportId: params.id,
          producerId: remoteProducerId,
          consumer,
        },
      ]);
      const {track} = consumer;
      if (params.kind === 'video') {
        const remote = new MediaStream();
        remote.addTrack(track);

        setRemoteStream(
          prev => {
            let tmp = prev;
            console.log('id', socketId, 'tmp', prev, 'yyy', tmp);
            tmp[socketId] = remote;
            return {...tmp};
          },
          // let remoteStr = prev.find(
          //   remoteStream => remoteStream.socketId === socketId,
          // );
          // if (remoteStr) {
          //   return prev;
          // } else {
          //   return [...prev, {remote: remote, socketId: socketId}];
          // }
        );
      }
      socket.emit('consumer-resume', {
        serverConsumerId: params.serverConsumerId,
      });
    },
  );
};
