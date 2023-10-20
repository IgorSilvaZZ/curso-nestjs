/* eslint-disable prettier/prettier */

const acksErros: string[] = ['E11000'];

export async function ackMessageError(
  channel: any,
  originalMessage: any,
  messageError: string,
) {
  const filterAckError = acksErros.filter((ackError) =>
    messageError.includes(ackError),
  );

  if (filterAckError) {
    await channel.ack(originalMessage);
    return;
  }
}
