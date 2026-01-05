import { vi } from "vitest";

export const mockFindOne = vi.fn();
export const mockFindById = vi.fn();
export const mockFind = vi.fn();
export const mockCountDocuments = vi.fn();
export const mockExec = vi.fn();
export const mockCreate = vi.fn();
export const mockSkip = vi.fn();
export const mockLimit = vi.fn();

export const createQueryMock = () => ({
  select: vi.fn().mockReturnValue({
    exec: mockExec,
  }),
  exec: mockExec,
});

export const createFindQueryMock = () => ({
  skip: mockSkip,
  limit: mockLimit,
  exec: mockExec,
});

export const mockJwtSign = vi.fn();

export const resetMocks = () => {
  vi.clearAllMocks();
  const queryMock = createQueryMock();
  const findQueryMock = createFindQueryMock();
  mockFindOne.mockReturnValue(queryMock);
  mockFindById.mockResolvedValue(null);
  mockFind.mockReturnValue(findQueryMock);
  mockCountDocuments.mockReturnValue({
    exec: mockExec,
  });
  mockSkip.mockReturnValue(findQueryMock);
  mockLimit.mockReturnValue(findQueryMock);
  mockJwtSign.mockClear();
  mockExec.mockClear();
  mockCreate.mockClear();
};
