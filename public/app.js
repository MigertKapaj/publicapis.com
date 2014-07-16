var perf = []

perf.push(performance.now())

window.onload = function() {
  getData()
  perf.push(performance.now())
  console.log("Window on load took " + (perf[1] - perf[0]) + " milliseconds.")
}

function getData() {
  var parallel = 2, apis, index
  perf.push(performance.now())
  var getAPIs = new XMLHttpRequest()
  getAPIs.open("GET", "json/apis.json", true)
  getAPIs.send()
  getAPIs.onreadystatechange = function () {
    if (getAPIs.readyState != 4 || getAPIs.status != 200) return
    apis = JSON.parse(getAPIs.responseText)
    console.log("APIs request took " + (performance.now() - perf[2]) + " milliseconds.")
    checkIfDone()
  }
  var getIndex = new XMLHttpRequest()
  getIndex.open("GET", "json/index.json", true)
  getIndex.send()
  getIndex.onreadystatechange = function () {
    if (getIndex.readyState != 4 || getIndex.status != 200) return
    index = JSON.parse(getIndex.responseText)
    console.log("Index request took " + (performance.now() - perf[2]) + " milliseconds.")
    checkIfDone()
  }
  function checkIfDone() {
    parallel--
    if (parallel === 0)
      indexAPIs(index, apis)
  }
}

function indexAPIs(index, apis) {
  perf.push(performance.now())
  var index = lunr.Index.load(index)
  perf.push(performance.now())
  console.log("Indexing Lunr took " + (perf[4] - perf[3]) + " milliseconds.")
  console.log("Total time took " + (perf[4] - perf[0]) + " milliseconds.")
  render(index, apis)
}

function render(index, apis) {
  var input = document.createElement('input')
  var pre = document.createElement('pre')
  input.setAttribute('placeholder',"Search through "+Object.keys(apis).length+" public APIs!")
  input.setAttribute("autofocus", "true");
  document.body.appendChild(input)
  document.body.appendChild(pre)

  input.onkeyup=function(){this.onchange()}
  input.onchange=function(){

    pre.innerHTML = "Searching for " + this.value;

    var results = index.search(this.value).map(function (result) {
      var api = apis[result.ref]
      // api['match'] = result.score
      return api
    })

    if (results.length) {
      pre.innerHTML = "Found " + results.length + " Results: \r\n\r\n" + JSON.stringify(results, null, 2);
    } else if (!this.value.length) {
      pre.innerHTML = "Go ahead, try again.";
    } else {
      if (this.value.length < 3) {
        pre.innerHTML = "Keep typing...";
      } else {
        pre.innerHTML = "No API found.";
      }
    }
    
  }
}