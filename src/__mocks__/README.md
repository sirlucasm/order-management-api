# Reusable Mocks

This directory contains reusable mocks for the project tests.

## How to use

### 1. Import the mocked functions and helpers

```typescript
import { vi } from "vitest";
import {
  resetMocks,
  mockFindOne,
  mockExec,
  mockCreate,
  mockJwtSign,
  createQueryMock,
} from "../../__mocks__/setup";
import {
  createMockUser,
  createMockRegisterDto,
  createMockLoginDto,
  createMockToken,
} from "../../__mocks__/user";
```

### 2. Configure the mocks at the top of the file (BEFORE imports)

```typescript
// IMPORTANT: vi.mock() must be at the top, before any import
vi.mock("../../lib/mongoose", () => ({
  database: {},
}));

vi.mock("../../lib/mongoose/schemas", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,
  },
  // Add other models as needed
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: mockJwtSign,
  },
}));

// Initialize the findOne mock
mockFindOne.mockReturnValue(createQueryMock());
```

### 3. Import the modules to be tested (AFTER mocks)

```typescript
import { registerUserService, loginUserService } from "./services";
```

### 4. Use resetMocks in beforeEach

```typescript
describe("My Tests", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-key";
    resetMocks(); // Resets all mocks
  });

  // your tests...
});
```

## Complete example

See `src/modules/auth/services.test.ts` for a complete usage example.

## Available mocks

### Mock Functions

- `mockFindOne`: Mock of `User.findOne()` or `Order.findOne()`
- `mockExec`: Mock of `.exec()` for Mongoose queries
- `mockCreate`: Mock of `User.create()` or `Order.create()`
- `mockJwtSign`: Mock of `jwt.sign()`
- `createQueryMock()`: Helper function to create chained query mocks
- `resetMocks()`: Function to reset all mocks

## File Structure

- `setup.ts`: Contains general mocks (Mongoose, JWT) and helper functions
- `user.ts`: Contains user-specific mocks using Faker

### User Data Generation Functions (user.ts)

- `createMockUser(overrides?)`: Generates a mocked user object with random data using Faker
- `createMockRegisterDto(overrides?)`: Generates a registration DTO with random data
- `createMockLoginDto(overrides?)`: Generates a login DTO with random data
- `createMockToken()`: Generates a random mocked JWT token

### Faker usage example

```typescript
import {
  createMockUser,
  createMockRegisterDto,
  createMockLoginDto,
  createMockToken,
} from "../../__mocks__/user";

// Generate random data
const userData = createMockRegisterDto();
const mockUser = createMockUser({ email: userData.email });
const token = createMockToken();

// Or with specific values
const specificUser = createMockUser({
  email: "test@example.com",
  id: "custom-id",
});
```
