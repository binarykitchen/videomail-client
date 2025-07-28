---
mode: 'agent'
tools: ['codebase', 'editFiles', 'runTests', 'search']
description: 'Generate unit tests for selected file'
---

# Unit Test Generation Instructions

When generating unit tests, please follow these guidelines:

1. For the selected file, generate a corresponding test file in the `__tests__` directory using the same name as the source file but ending with `.test.ts`.
2. If the __tests__ directory does not exist, create it. Or else just generate the test file in the same directory as the source file.
3. Ensure the test file imports the necessary functions or classes from the source file.
4. Use the Vitest framework for writing tests.
5. Write tests that cover the functionality of the source file, including edge cases and error handling.
6. Honour the global Vitest configuration found in the root folder at `vitest.config.ts`.
7. There is no need to import Vitest's `expect` or `describe` as they are globally available.

## Preferred Test Structure

```typescript
// filepath: src/component/__tests__/component.test.ts
import { ... } from '../component'

describe('Component Name', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  it('should do something specific', () => {
    // Test case
  })
})
```