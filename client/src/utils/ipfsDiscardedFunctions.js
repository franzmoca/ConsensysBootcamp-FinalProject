// This code is not useful right now and probably should be written diffently.
// i'm keeping track of it just in case I decide to implement an IPFS node back it.

initIPFS = async () => {
    //const self = this
    let node = new IPFS({ repo: String(Math.random() + Date.now()) })
    this.setState({ipfs:node})

    console.log('IPFS node is ready')
    node.once('ready', () => {
      console.log('IPFS node is ready')
      this.setState({ipfs:node})
      /*node.id((err, res) => {
        if (err) {
          throw err
        }
        console.log(res.id)
      })*/
    })
  }
  
  loadImageIpfs = async (ipfsPath) =>{
    return new Promise((resolve => {
    const node = this.state.ipfs;
    node.once('ready', () => {
      console.log(node)
      node.cat(ipfsPath, function (err, file) {
        if (err) {
            throw err//fallback
        }
        const img = "data:image/png;base64," + file.toString("base64");
        resolve(img)
      })
    })}))
  }