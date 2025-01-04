import dgram from "node:dgram";
import dnsPacket from "dns-packet";

const server = dgram.createSocket("udp4");

const db = {
  "google.com": {
    type: "A",
    data: "1.2.4.5.",
  },
  "facebook.com": {
    type: "A",
    data: "3.3.3.2",
  },
};

server.on("error", (err) => {
  console.log("Error: ", err);
  server.close();
});

server.on("message", (message, rinfo) => {
  const incomingRequest = dnsPacket.decode(message);
  const ipFromDb = db[incomingRequest.questions[0].name];

  if (!ipFromDb) {
    return server.send(message, rinfo.port, rinfo.address);
  }

  const ans = dnsPacket.encode({
    type: "response",
    id: incomingRequest.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingRequest.questions,
    answers: [
      {
        type: ipFromDb.type,
        class: "IN",
        name: incomingRequest.questions[0].name,
        data: ipFromDb.data,
      },
    ],
  });

  server.send(ans, rinfo.port, rinfo.address);
});

server.on("listening", () => {
  const address = server.address();
  console.log(
    `Server listing on ${address.address} address and port ${address.port}`,
  );
});

server.bind(5300, () => {
  console.log(`Binded to port no ${5300}`);
});
