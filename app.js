require('colors')

const { guardarDB, leerDB} = require('./helpers/guardarArchivo');
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist
} = require("./helpers/inquirer");
const Tareas = require('./models/tareas');


const main =  (async () => {


  let opt = ''
  const tareas = new Tareas()

  const tareasDB = leerDB()

  if( tareasDB ){
    //Establecer las tareas
    //TODO: cargarTareasFromArr()
    tareas.cargarTareaFromArr(tareasDB);

     
  }
    

  do {
    //Imprimir el menú
    opt = await inquirerMenu()
    // console.log({ opt });

    switch (opt) {
      case  '1':
        // crear opcion        
        const desc = await leerInput('Descripción:')
        tareas.crearTarea( desc )
        break;
      case  '2':
        tareas.ListadoCompletado()
        break;
      case  '3': //Listar completadas
        tareas.listarPendientesCompletadas();
        break;
      case  '4': // Listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case  '5': // Completar tareas
        const ids = await mostrarListadoChecklist( tareas.listadoArr )
        tareas.toggleCompletadas( ids )
        break;
      case  '6': // Borrar
        const id =  await listadoTareasBorrar(tareas.listadoArr)
        if( id !== '0'){
          const  ok = await confirmar('¿Está seguro?')
          if( ok ){
            // console.log({ id });
            tareas.borrarTarea( id )
            console.log('Tarea borrada correctamente');
          }
          
        }
        break;

    }

    guardarDB( tareas.listadoArr )


    await pausa()
  
    
  } while (opt !== '0');
})()

