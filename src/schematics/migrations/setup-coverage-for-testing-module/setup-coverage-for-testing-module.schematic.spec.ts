import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Setup specs for testing module', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'setup-coverage-for-testing-module';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function runSchematic(name?: string): Promise<UnitTestTree> {
    return runner
      .runSchematicAsync(
        schematicName,
        {
          defaultProjectName: name || defaultProjectName,
        },
        tree
      )
      .toPromise();
  }

  function validateFiles() {
    const entryPointContents = tree.readContent(
      `projects/${defaultProjectName}/src/test.ts`
    );
    expect(entryPointContents)
      .toEqual(`const context = (require as any).context('./', true, /.spec.ts$/);
context.keys().map(context);
`);
  }

  it('should setup testing module for code coverage', async () => {
    await runSchematic();
    validateFiles();
  });

  it('should abort if project type is application', async () => {
    tree = await createTestApp(runner, {
      defaultProjectName: 'my-app',
    });

    const updatedTree = await runSchematic('my-app');

    expect(updatedTree.exists('projects/my-app/testing/src/test.ts')).toEqual(
      false
    );
  });

  it('should abort if testing module already setup', async () => {
    await runSchematic();
    validateFiles();
    // Run the schematic again.
    await runSchematic();
    validateFiles();
  });
});
