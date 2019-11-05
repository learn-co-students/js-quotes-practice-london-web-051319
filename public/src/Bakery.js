const d = document;
const $ = (s, thing = d) =>  thing.querySelector(s);
const bam = s => d.createElement(s);
const cls = (thing, c) => thing.classList.add(c);
const txty = (thing, t) =>( thing.innerText = t);
const v = (thing, v) => (thing.value = v);
const tsk = (thing, type, func) => thing.addEventListener(type, func);
const j = d => d.json();
const voom = (thing, s, opts) => {
  const r = bam(s);
  thing && thing.appendChild(r);
  opts.cl && cls(r, opts.cl);
  opts.t && txty(r, opts.t);
  opts.v && v(r, opts.v)
  opts.f && opts.f.length === 2 && tsk(r, opts.f[0], opts.f[1]);
  return r;
};
const fopts = (type, body) => {
  const opts = {
    method: type,
  };
  if (body) {
    opts.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    opts.body = JSON.stringify(body);
  }
  return opts
}
const tag = (thing, cl) => thing.classList.toggle(cl);
const QSURL =  "http://localhost:3000/quotes"
const QSLURL =  QSURL + "?_embed=likes";



function makeBread() {
  const dv = $(".center div");
  const renderSort = () => {
    const bSort = voom(null, "button", {t: "Sort", f: ["click", () => {
      getQuotes(QSLURL + (tag(bSort, "sorted") ? "&_sort=author" : ""))
    }]});
    dv.insertBefore(bSort, dv.firstChild);
  }
  const getQuotes = (url = QSLURL) => fetch(url).then(resp => resp.json()).then(quotes => {
      [...$("#quote-list").children].forEach(e => e.remove());
      quotes.forEach(renderQuote);
    });
      renderSort();
      getQuotes();

  const renderQuote = ({quote, author, likes, id}) => {
    const b = voom(voom($("#quote-list"), "li", "quote-card"), "blockquote", {cl: "blockquote"});
    const p = voom(b, "p", {cl: "mb-0", t: quote});
    const footer = voom(b, "footer", {cl: "blockquote-footer", t: author});
    const br = bam("br");

    const bLike = voom(b, "button", {cl: "btn-success", t: "Likes: ", f: ["click", () => {
      fetch("http://localhost:3000/likes", fopts("post", {
        quoteId: id,
        createAt: Date.now()
      }))
      .then(getQuotes());
    }]});
    const bDelete = voom(b, "button", {cl: "btn-danger", t: "Delete", f: ["click", () => {
      fetch(QSURL + "/" + id, fopts("DELETE"))
      .then(___ => {
          getQuotes();
        })
      }]});
    voom(bLike, "span", {t: likes.length + ""});
    const bEdit = voom(b, "button", {cl: "btn-info", t: "Edit", f: ["click", () => {
      p.remove();
      bEdit.remove();
      const text = voom(null, "textarea", {v: quote})
      const bChange = voom(null, "button", {t: "Confirm Changes", f: ["click", () => {
        fetch(QSURL + "/" + id, fopts("PATCH", { "quote": text.value }))
        .then( __ => getQuotes());
      }]});
      b.append(text, footer, br, bLike, bDelete, bChange)
    }]});
  }

  $("#new-quote-form").addEventListener("submit", e => {
    e.preventDefault();
    fetch(QSURL, fopts("POST", {quote: $("#new-quote").value, author: $("#author").value}))
    .then(resp => resp.json())
    .then(data => {
      fetch(QSURL + "/" + data.id + "?_embed=likes")
      .then(j)
      .then(renderQuote);
      [$("#new-quote"), $("#author")].forEach(e => e.value = "");
    });

  })
}
