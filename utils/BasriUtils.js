module.exports = {
  BasriLogger: (req, res) => {
    console.log('====================')
    console.log('Basri logger (req): ', Object.keys(req));
    console.log('====================')
  }
};
