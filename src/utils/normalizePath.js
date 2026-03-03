const normalizePath = (path) => path.split('/').filter(path => path.length > 0);

export default normalizePath;