import { Rule } from '@angular-devkit/schematics';

import { updateLibraryPeerDependencies } from '../../rules/update-library-peer-dependencies';

export default function updateLibraryDependencies(): Rule {
  return updateLibraryPeerDependencies();
}
