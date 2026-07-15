// Canonical keys + default widths (px) for the resizable columns of the consumer-session
// message table. The `index` column is intentionally excluded: it stays a fixed-width sticky
// column whose width feeds `publishTime`'s sticky offset. Value-projection columns are dynamic
// and keep their own configured widths.
export type MessageColumnKey =
  | 'publishTime'
  | 'key'
  | 'value'
  | 'sessionTargetIndex'
  | 'topic'
  | 'producerName'
  | 'schemaVersion'
  | 'size'
  | 'properties'
  | 'eventTime'
  | 'brokerPublishTime'
  | 'messageId'
  | 'sequenceId'
  | 'orderingKey'
  | 'redeliveryCount'
  | 'sessionContextState';

export const messageColumnDefaultWidths: Record<MessageColumnKey, number> = {
  publishTime: 180,
  key: 160,
  value: 240,
  sessionTargetIndex: 64,
  topic: 460,
  producerName: 380,
  schemaVersion: 120,
  size: 96,
  properties: 240,
  eventTime: 200,
  brokerPublishTime: 200,
  messageId: 300,
  sequenceId: 100,
  orderingKey: 110,
  redeliveryCount: 130,
  sessionContextState: 380,
};
