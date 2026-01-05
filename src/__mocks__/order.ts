import { faker } from "@faker-js/faker";

export const createMockService = (overrides?: Partial<any>) => {
  return {
    name: faker.commerce.productName(),
    value: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    status: "PENDING" as const,
    ...overrides,
  };
};

export const createMockOrder = (overrides?: Partial<any>) => {
  return {
    _id: faker.database.mongodbObjectId(),
    id: faker.database.mongodbObjectId(),
    lab: faker.company.name(),
    patient: faker.person.fullName(),
    customer: faker.person.fullName(),
    state: "CREATED" as const,
    status: "ACTIVE" as const,
    services: [createMockService(), createMockService()],
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    save: async function () {
      return this;
    },
    ...overrides,
  };
};

export const createMockCreateOrderDto = (overrides?: Partial<any>) => {
  return {
    lab: faker.company.name(),
    patient: faker.person.fullName(),
    customer: faker.person.fullName(),
    services: [
      {
        name: faker.commerce.productName(),
        value: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      },
    ],
    ...overrides,
  };
};
