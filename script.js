function parse(input) {
    let output = `"${input}"`
    if (input.startsWith('EUR ')) {
        output = `"${input.replace('EUR ', '').split('.').join('')}"`
    }
    return output
}

function table_csv(t) {
    let x = []
    t.querySelectorAll('tr').forEach((r) => {
        let y = []
        r.querySelectorAll('td, th').forEach((c) => {
            y.push(parse(c.textContent))
        })
        x.push(y)
    })
    let l = x[0].length
    x.forEach((r, i) => {
        if (!(r.length === l)) {
            r.unshift('')
        }
        x[i] = r.join(',')
    })
    return x.join('\n')
}

document.querySelectorAll('table tbody').forEach((t) => {
    let href = `data:text/csv,${encodeURIComponent(table_csv(t))}`
    t.insertAdjacentHTML('beforeend', `
        <tr><td><a href="${href}" download="export.csv">Download</a></td></tr>
    `)
})
