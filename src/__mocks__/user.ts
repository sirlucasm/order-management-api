import { faker } from "@faker-js/faker";

export const createMockUser = (overrides?: Partial<any>) => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    ...overrides,
  };
};

export const createMockRegisterDto = (overrides?: Partial<any>) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    ...overrides,
  };
};

export const createMockLoginDto = (overrides?: Partial<any>) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    ...overrides,
  };
};

export const createMockToken = () => {
  return faker.string.alphanumeric(32);
};
