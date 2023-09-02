import { FastifyInstance } from 'fastify';

export default async (instance: FastifyInstance) => {
  instance.get('/health', () => Promise.resolve({ healthy: true }));
};
