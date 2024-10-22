# Alcances de la herramienta
Como equipo escogimos Jest debido a que se ajusta de forma precisa a el stack de tecnologías que seleccionamos. Esta herramienta tiene como principal objetivo la creación de tests unitarios y de integración de una manera rápida y eficiente, a través de pruebas automáticas, mocking de módulos y dependencias, como también aserciones.

# Descripción del trabajo realizado
## Proyecto
La solución propuesta para los requerimientos planteados, es el desarrollo de una aplicación web, la cual contempla la implementación de módulos de autenticación para cliente y administrador, gestión de productos, catálogo de productos, sistema de pujas y envío de correos electrónicos. Esta solución fue desarrollada usando el patrón Modelo-Vista-Controlador para la división de responsabilidades y levantada de manera local.

## Dependencias entre la herramienta y la aplicación
Jest se incorpora en nuestro proyecto a través de pruebas unitarias y de sistema, permitiendo realizar mocks de dependencias como querys a la base de datos, y llamadas cruzadas entre controladores, lo cual nos permite verificar comportamientos deseados y no deseados.

# Pruebas
## Estrategia de pruebas utilizadas
La estrategia de pruebas se centró en la realización de pruebas unitarias y de sistema, con el objetivo de garantizar la estabilidad y correcto funcionamiento de los módulos críticos. Las pruebas cubrieron específicamente los módulos de gestión de productos, autenticación, y pujas, los cuales son fundamentales para el flujo operativo de la aplicación. La organización de las pruebas se hizo por funcionalidad, lo que permitió mantener una estructura clara y eficiente al abordar los diferentes componentes del sistema.

Para definir el éxito de una prueba, se estableció como criterio que el test debía pasar todas las aserciones definidas, validando así que la funcionalidad probada cumpliera con los resultados esperados. Los errores detectados surgieron principalmente de discrepancias entre la implementación y los resultados esperados, así como de cambios introducidos en las funcionalidades correspondientes.

Todas las pruebas fueron automatizadas, permitiendo ejecutar un conjunto robusto de pruebas de manera eficiente y repetitiva en el entorno de desarrollo.

## Procedimiento de ejecución de pruebas
El procedimiento de ejecución de pruebas consistía en terminar un módulo, desarrollar y ejecutar la prueba. Si esta prueba no pasaba en todos los casos, se debía corregir el código respectivo. Normalmente se ejecutaban todas las pruebas al finalizar cualquier módulo para asegurar que no se rompieran partes de la aplicación de manera no intencional. Por último, previo a la finalización del sprint, se desarrollaron pruebas de sistema en base a casos de uso, para comprobar si era necesario realizar correcciones al código.

# Reporte de resultados
Contamos con 4 suites de pruebas (1 de integración por cada módulo y 1 de sistema que cubre 2 casos de uso) con 31 casos de prueba en total, los cuales, al ejecutarlos todos con npm test, entregan lo siguiente:

Test Suites: 4 passed, 4 total
Tests: 31 passed, 31 total
Snapshots: 0 total
Time: 5.215 s
Ran all test suites.

Por lo que podemos afirmar que todos los módulos cumplen con las pruebas correspondientes a la implementación de su lógica.

# Problemas encontrados y soluciones
Uno de los problemas encontrados fue el cumplimiento de fechas ya que para algunas historias de usuario y tareas, se sobreestima o se subestima la cantidad de horas de dedicación que debemos darle a cada una. Para solucionar eso realizamos reuniones periódicas y a veces, de emergencia, para mejorar las estimaciones de tiempo, y evitar bloqueos técnicos debido a las dependencias entre distintos módulos.

Otro de los problemas fue que al momento de realizar cambios, no siempre tenemos en cuenta las dependencias con otros módulos los cuales podrían verse afectados en este cambio. Para resolver este problema, cuando nos encontramos con esta situación, la comunicamos, buscamos un consenso de solución y asignamos a la persona que resolverá el problema.

Más que problema encontrado, fue un desafío hacer uso de Git Flow en los flujos de trabajo, ya que a menudo nos topamos con conflictos entre los cambios realizados al repositorio remoto, los cuales solucionamos mediante el aprendizaje más a fondo de comandos de git que nos permitan realizar los flujos de manera ordenada y eficiente.

# Infraestructura de la aplicación web
La aplicación al ser construida con el patrón MVC, permite la división eficiente de las responsabilidades, y el levantamiento a producción, flexible. En este caso, fue levantado de manera local usando 3 servidores, de backend, frontend, y base de datos, respectivamente. Esta infraestructura puede levantarse tanto en una única máquina virtual en la nube, como también dividiéndola en distintos servicios en la nube como EC2 y RDS.