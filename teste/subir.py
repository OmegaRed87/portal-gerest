import pathlib, shutil, sys
import sei_portal
tmp = pathlib.Path(sys.argv[1]); pag = tmp / "pagina"; pag.mkdir(parents=True, exist_ok=True)
origem = pathlib.Path.home() / "portal-gerest"
for a in ("motor.js", "marca_prefeitura.png"):
    shutil.copy(origem / a, pag)
(pag / "index.html").write_text((origem / "index.html").read_text().replace("</body>", '<script src="teste-e2e.js"></script></body>'))
shutil.copy(tmp / "teste-e2e.js", pag)
sei_portal.PASTA, sei_portal.PAGINA = tmp / "portal", pag
sei_portal.ESTATICOS["/teste-e2e.js"] = ("teste-e2e.js", "text/javascript")
sei_portal.servir(8799).serve_forever()
