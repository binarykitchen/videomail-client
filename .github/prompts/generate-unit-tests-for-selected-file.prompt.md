---
agent: "agent"
tools: ["search/codebase", "edit/editFiles", "search"]
description: "Generate unit tests for selected file"
---

# Unit Test Generation Instructions

When generating unit tests, please follow these guidelines:

1. For the selected file, generate a corresponding test file in the `__tests__` directory using the same name as the source file but ending with `.test.ts`.
2. If the **tests** directory does not exist, create it. Or else just generate the test file in the same directory as the source file.
3. If there are already unit tests presents, please do not override these but amend those you are suggesting in the same describe block.
4. Ensure the test file imports the necessary functions or classes from the source file.
5. Use the Vitest framework for writing tests.
6. Make sure to use the latest features of the Vitest package defined in the package.json
7. Write tests that cover the functionality of the source file, including edge cases and error handling.
8. When generating imports, ensure their paths are correct and not broken and that the imports are sorted.
9. Do not mock any functions or modules. Accept anything the file to be tested imports.
10. Any values to be tested should be types constants defined in the top parent describe block and reused.
11. Group unit test cases in subsequent describe blocks based on the subject to be tested.
12. Honour the global Vitest configuration found in the root folder at `vitest.config.ts`.
13. There is no need to import Vitest's `expect` or `describe` as they are globally available.
14. Whenever you generate the unit test code, ensure it produces no TypeError or ESLint errors.

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
