module.exports = (prefix) => {
  if(prefix[0]  !== '/') prefix = '/' + prefix
  if(prefix[prefix.length-1] !== '/') prefix = prefix +  '/'
  return (path) => {
    if(path[0] === '/') path = path.substring(1)
    return prefix + path
  }
}