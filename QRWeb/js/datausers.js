// Realizamos las dos solicitudes de forma asíncrona
Promise.all([
  fetch('http://192.168.100.7:3000/api/v3.4/acces/users').then(response => {
    if (!response.ok) {
      throw new Error(`Error en la respuesta de usuarios: ${response.status}`);
    }
    return response.json(); // Convierte la respuesta en JSON
  }),
  fetch('http://192.168.100.7:3000/api/v3.4/acces/sensor/data').then(response => {
    if (!response.ok) {
      throw new Error(`Error en la respuesta de sensor data: ${response.status}`);
    }
    return response.json(); // Convierte la respuesta en JSON
  })
])
  .then(([usersData, sensorData]) => {
    // usersData es el resultado de la primera solicitud (usuarios)
    // sensorData es el resultado de la segunda solicitud (sensor)

    // Verificamos que usersData sea un array
    if (Array.isArray(usersData)) {
      const estudiantes = usersData.length; // Contamos los estudiantes

      // Mostrar el número de estudiantes
      document.getElementById('estudiantes').innerText = estudiantes;

      // Ahora desestructuramos los datos del sensor
      const { asistenciasHoy, ingresoPorDia } = sensorData;

      // Mostrar el valor de "asistenciasHoy"
      document.getElementById('asistenciasHoy').innerText = asistenciasHoy;

      // Calcular las ausencias
      const ausencias = estudiantes - asistenciasHoy; // Estudiantes - Asistencias hoy
      document.getElementById('ausencias').innerText = ausencias;

      const porcentajeAsistencia = (asistenciasHoy / estudiantes) * 100;
      document.getElementById('porcentajeAsistencia').innerText = porcentajeAsistencia.toFixed(2) + "%"; // Muestra 2 decimales

      const progresoBarra = document.getElementById('porcentajeAsistenciaBarra');
      progresoBarra.style.width = `${porcentajeAsistencia}%`; // Ajusta el ancho de la barra



       // Aquí es donde trabajamos los datos de la gráfica
       const labels = ingresoPorDia.map(item => item.date); // Las fechas
       const dataValues = ingresoPorDia.map(item => item.count); // Los ingresos (counts)
 
       // Crear la gráfica de líneas
       var ctx = document.getElementById("myLineChart");
       var myLineChart = new Chart(ctx, {
         type: 'line',
         data: {
           labels: labels, // Fechas en el eje X
           datasets: [{
             label: "Ingresos",
             lineTension: 0.3,
             backgroundColor: "rgba(78, 115, 223, 0.05)",
             borderColor: "rgba(78, 115, 223, 1)",
             pointRadius: 3,
             pointBackgroundColor: "rgba(78, 115, 223, 1)",
             pointBorderColor: "rgba(78, 115, 223, 1)",
             pointHoverRadius: 3,
             pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
             pointHoverBorderColor: "rgba(78, 115, 223, 1)",
             pointHitRadius: 10,
             pointBorderWidth: 2,
             data: dataValues, // Los ingresos como datos
           }]
         },
         options: {
           maintainAspectRatio: false,
           layout: {
             padding: {
               left: 10,
               right: 25,
               top: 25,
               bottom: 0
             }
           },
           scales: {
             xAxes: [{
               time: {
                 unit: 'category' // Usamos 'category' para las fechas
               },
               gridLines: {
                 display: false,
                 drawBorder: false
               },
               ticks: {
                 maxTicksLimit: 7
               }
             }],
             yAxes: [{
               ticks: {
                 max: 100, // Limitar el eje Y de 0 a 100
                 min: 0,
                 maxTicksLimit: 5,
                 padding: 10,
                 // Formato de los valores del eje Y
                 callback: function(value, index, values) {
                   return value + "%"; // Mostrar los valores como porcentaje
                 }
               },
               gridLines: {
                 color: "rgb(234, 236, 244)",
                 zeroLineColor: "rgb(234, 236, 244)",
                 drawBorder: false,
                 borderDash: [2],
                 zeroLineBorderDash: [2]
               }
             }],
           },
           legend: {
             display: true
           },
           tooltips: {
             backgroundColor: "rgb(255,255,255)",
             bodyFontColor: "#858796",
             titleMarginBottom: 10,
             titleFontColor: '#6e707e',
             titleFontSize: 14,
             borderColor: '#dddfeb',
             borderWidth: 1,
             xPadding: 15,
             yPadding: 15,
             displayColors: false,
             intersect: false,
             mode: 'index',
             caretPadding: 10,
             callbacks: {
               label: function(tooltipItem, chart) {
                 return 'Ingresos: ' + tooltipItem.yLabel + "%"; // Muestra los valores con '%'
               }
             }
           }
         }
       });

       const datosGrafica = [asistenciasHoy, ausencias];

      // Crear el gráfico de pastel (dona)
      var ctx = document.getElementById("myPieChart");
      var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Asistencia", "Ausencia"],  // Las etiquetas de la gráfica
          datasets: [{
            data: datosGrafica,  // Datos de asistencia y ausencia
            backgroundColor: ['#008000', '#ff0000'],  // Colores para los segmentos
            hoverBackgroundColor: ['#008000', '#FF0000'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          }],
        },
        options: {
          maintainAspectRatio: true,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          legend: {
            display: true  // Activamos la leyenda
          },
          cutoutPercentage: 80,  // Hace que el gráfico sea una dona (con un agujero en el medio)
        },
      });
    } else {
      console.log('La respuesta de usuarios no es un array');
    }
  })
  .catch(error => {
    console.error('Error al realizar una de las solicitudes:', error);
  });



