import "../styles.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import toast, { Toaster } from "react-hot-toast";

export default function ZonaIndustrial() {
  //Definicion variables de estado
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState({});
  const [placa, setPlaca] = useState("");
  const [empresa, setEmpresa] = useState("default");
  const [disabled, setDisabled] = useState(false);
  const [continuar, setContinuar] = useState(true);
  const [respuesta, setRespuesta] = useState({});

  //Dominios de los correos
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

  //Funcion para mandar alerta al momento de realizarse correctamente.
  function onSucces(msj) {
    setContinuar(false);
    toast.dismiss(msj);
    swal("Agregado con éxito.");
    setDisabled(false);
  }

  //Funcion llamada al momento de logearse
  function handleCallbackResponse(response) {
    setRespuesta(response);
    let userObject = jwt_decode(response.credential);
    setUser(userObject);
    setNombre(userObject.name);
    //Para asegurarse que el correo es corporativo
    if (userObject.hd) {
      setEmpresa(
        userObject.hd.replace(".com", "").replace(".pro", "").toUpperCase()
      );
    } else {
      setEmpresa("gmail");
    }
    document.getElementById("signInDiv").style.display = "none";
  }

  //Función llamada al momento de enviar la Form
  function Submit(e) {
    e.preventDefault();
    const msj = toast.loading("Enviando...");
    setDisabled(true);
    const formEle = document.querySelector("form");
    const formDatab = new FormData(formEle);
    let userObject = jwt_decode(respuesta.credential);
    const usuario = {
      nombre: formDatab.get("nombre"),
      placa: formDatab.get("placa").toUpperCase(),
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
      oficina: "IWS Zona Industrial"
    };
    const getFormData = (usuario) =>
      Object.keys(usuario).reduce((formData, key) => {
        formData.append(key, usuario[key]);
        return formData;
      }, new FormData());
    fetch(
      "https://script.google.com/macros/s/AKfycbzOm80ZSN2pejIiDpnJKqv5hl9UAcyWbnZ9EnwUdGInUA1IugqSX2aTdL-aOjNmjFG9/exec",
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

  //Establece la key de la API de google y crea el boton de login
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

  //HTML de la pagina
  return (
    <div className="Zona">
      <Toaster />
      <img
        src="https://drive.google.com/uc?export=view&id=1QN8msgP7kFJ8nf_TgAYsEQ235lPrsrbE"
        alt="Acceso base Zona Industrial"
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
            <input
              placeholder="Placa de vehiculo"
              name="placa"
              type="text"
              required
              value={placa}
              onChange={e => setPlaca(e.target.value)}
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
