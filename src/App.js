import "./styles.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import toast, { Toaster } from "react-hot-toast";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import zonaindustrial from "./pages/zonaindustrial";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState({});
  const [empresa, setEmpresa] = useState("default");
  const [disabled, setDisabled] = useState(false);
  const [continuar, setContinuar] = useState(true);
  const [respuesta, setRespuesta] = useState({});

  const dominios = [
    "SINOENERGYCORP",
    "INTEGRA-WS",
    "PETROALIANZA",
    "DYNAXTREAM",
    "ENTERGIX",
    "NEOCONEX",
    "XENIXSERVICES",
    "XPERTSENERGY",
    "ESSENTIAL-OFS",
    "KYBALIONTECH",
    "PROILIFT"
  ];

  function onSucces(msj) {
    setContinuar(false);
    toast.dismiss(msj);
    swal("Agregado con éxito.");
    setDisabled(false);
  }

  function handleCallbackResponse(response) {
    setRespuesta(response);
    let userObject = jwt_decode(response.credential);
    setUser(userObject);
    setNombre(userObject.name);
    if (userObject.hd) {
      setEmpresa(
        userObject.hd.replace(".com", "").replace(".pro", "").toUpperCase()
      );
    } else {
      setEmpresa("gmail");
    }
    document.getElementById("signInDiv").style.display = "none";
  }

  function Submit(e) {
    e.preventDefault();
    const msj = toast.loading("Enviando...");
    setDisabled(true);
    const formEle = document.querySelector("form");
    const formDatab = new FormData(formEle);
    let userObject = jwt_decode(respuesta.credential);
    const usuario = {
      nombre: formDatab.get("nombre"),
      empresa: userObject.hd
        .replace(".pro", "")
        .replace(".com", "")
        .toUpperCase(),
      fecha:
        "'" +
        new Date().toLocaleDateString("es-VE") +
        " " +
        new Date().toLocaleTimeString("es-VE", { timeStyle: "short" }),
      estado: "Empleado",
      correo: userObject.email,
      fechaFormat:
        new Date().toLocaleDateString("es-VE") +
        " " +
        new Date().toLocaleTimeString("es-VE", {  hour12: false  }),
      tipo: formDatab.get("tipo"),
      oficina: "IWS Petroriente"
    };
    const getFormData = (usuario) =>
      Object.keys(usuario).reduce((formData, key) => {
        formData.append(key, usuario[key]);
        return formData;
      }, new FormData());
    fetch(
      "https://script.google.com/macros/s/AKfycbw1Pbz541U6KuoD1QnMB7noC3KN61luyHtST31ELcammqZc2X1fRJ7TOBcf_nPx8tIZDg/exec",
      {
        method: "POST",
        "Content-Type": "multipart/form-data",
        body: getFormData(usuario)
      }
    )
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss(msj);
        swal("Agregado con éxito.");
      })
      .catch((error) => {
        onSucces(msj);
      });
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id:
        "34248424590-67kpni48sj73d94n69249m5ifh7cj1r7.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large"
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<zonaindustrial />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Toaster />
      <img
        src="https://drive.google.com/uc?export=view&id=1cSYGwSwZ35eh9nxmMYq3YpdmlNlPeJbv"
        alt="Acceso oficina petroriente"
      />
      <br />
      <div id="signInDiv" className="signInDiv"></div>
      {dominios.includes(empresa) && continuar && (
        <div>
          <form className="form" onSubmit={(e) => Submit(e)}>
            <input
              placeholder="nombre"
              name="nombre"
              type="text"
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
            <select required name="tipo">
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
            <input
              id="enviar"
              value="Enviar"
              type="submit"
              disabled={disabled}
            />
          </form>
        </div>
      )}

      {empresa != "default" && !dominios.includes(empresa) && (
        <h1>Correo inválido.</h1>
      )}

      {!continuar && (
        <h1>Registrado correctamente, por favor cierre la pagina.</h1>
      )}
    </div>
  );
}
