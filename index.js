var fs = require('fs')
var readdirp = require('readdirp')
var lunr = require('lunr')

var base = './data/apis/'
var apis = {}

var index = lunr(function () {
    this.ref('slug')
    this.field('name', {boost: 10})
    this.field('provider', {boost: 5})
    this.field('tags', {boost: 2})
    this.field('description')
  })

readdirp(
  { root: base },
  function(fileInfo) { 
    var api = require(base+fileInfo.path)
    var obj = {
      'name' : api.title,
      'slug' : api.id,
      'provider' : api.author.name,
      'image' : api.image,
      'link' : api.link,
      'tags' : api.tags.join(', '),
      'description' : api.description
    }
    index.add(obj)
    apis[obj.slug] = obj
  },
  function (err, res) {
    fs.writeFile('./public/json/index.json', JSON.stringify(index), function(err) {
      if(err) throw err
    }) 
    fs.writeFile('./public/json/apis.json', JSON.stringify(apis), function(err) {
      if(err) throw err
    }) 
  }
)