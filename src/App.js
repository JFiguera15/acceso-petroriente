import "./styles.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import toast, { Toaster } from "react-hot-toast";



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
    let userObject = jwt_decode(respuesta.credential);
    const usuario = {
      nombre: userObject.name,
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
        new Date().toLocaleTimeString("es-VE", { timeStyle: "short" })
    };
    const getFormData = (usuario) =>
      Object.keys(usuario).reduce((formData, key) => {
        formData.append(key, usuario[key]);
        return formData;
      }, new FormData());
    fetch(
      "https://script.google.com/macros/s/AKfycbyfugIKG48CTz9F6StKxc8dU-m7PL9OAasZBC8ZUCripgI5DvRrtRrwitN_mjsRPJDfNA/exec",
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
        "980167007724-257455vafejni63nl1ocp3fms2bia1pc.apps.googleusercontent.com",
      api_key: "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",
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
      <Toaster />
      <img
        src="https://drive.google.com/uc?export=download&id=1F3z83Q7NdqnNTlI66LThAkM0ZUPTMmcD"
        alt="Acceso oficina petroriente"
      />
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
            />
            <input
              type="hidden"
              name="fecha"
              value={
                "'" +
                new Date().toLocaleDateString("es-VE") +
                " " +
                new Date().toLocaleTimeString("es-VE", { timeStyle: "short" })
              }
            />
            <input
              type="hidden"
              name="fechaFormateada"
              value={
                new Date().toLocaleDateString("es-VE") +
                " " +
                new Date().toLocaleTimeString("es-VE", { timeStyle: "short" })
              }
            />
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
