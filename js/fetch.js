const dolar = document.querySelector("#dolar")

fetch('https://api-dolar-argentina.herokuapp.com/api/dolaroficial', )
    .then(resp => resp.json())
    .then(data => dolar.innerHTML = `<p>TOMAMOS DOLARES A LA COTIZACIÓN DEL DIA. LA COTIZACIÓN ACTUAL ES DE: ${data.venta}</p>`)