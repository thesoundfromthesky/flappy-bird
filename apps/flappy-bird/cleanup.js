import globby from 'globby';
import path from 'node:path';

export default function beforeAdd(git) {
  const options = {
    remove: '.',
    dest: '.',
    dotfiles: true,
  };
  const files = globby
    .sync(options.remove, {
      cwd: path.join(git.cwd, options.dest),
      dot: options.dotfiles,
    })
    .map((file) => path.join(options.dest, file));

  if (files.length > 0) {
    return git.rm(files);
  } else {
    return git;
  }
}
