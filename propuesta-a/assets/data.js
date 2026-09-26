export const config = {
  whatsapp: '56900000000',
  email: 'hola@mjnpropiedades.cl',
  hours: 'Lunes a viernes · 09:00 a 18:00',
  coverage: 'Región de O’Higgins · Rancagua, Machalí, Colchagua y litoral',
  instagram: '#',
};

export const properties = [
  {slug:'casa-machali', code:'MJN-021', title:'Casa contemporánea con vista al valle', operation:'Venta', type:'Casa', comuna:'Machalí', sector:'Sierras de Machalí', price:'UF 14.800', beds:4, baths:3, parking:2, area:'680 m² terreno', status:'Disponible', image:'gallery-machali/01-exterior.png', gallery:['gallery-machali/01-exterior.png','gallery-machali/02-acceso.png','gallery-machali/03-estar.png','gallery-machali/04-cocina.png','gallery-machali/05-dormitorio.png','gallery-machali/06-bano.png','gallery-machali/07-estudio.png','gallery-machali/08-comedor.png','gallery-machali/09-terraza.png','gallery-machali/10-piscina.png'], mapQuery:'Machalí, O’Higgins, Chile', description:'Una propuesta de vida luminosa, con espacios que conectan terraza, jardín y vista abierta al valle. Visual referencial de una ficha demostrativa.'},
  {slug:'casa-pichilemu', code:'MJN-018', title:'Casa de una planta cerca del mar', operation:'Venta', type:'Casa', comuna:'Pichilemu', sector:'Punta de Lobos', price:'UF 18.900', beds:4, baths:3, parking:3, area:'720 m² terreno', status:'Disponible', image:'casa-demo.png', mapQuery:'Punta de Lobos, Pichilemu, O’Higgins, Chile', description:'Arquitectura cálida, jardín nativo y un ritmo pausado para disfrutar del litoral. Visual referencial de una ficha demostrativa.'},
  {slug:'depto-rancagua', code:'MJN-014', title:'Departamento luminoso cerca del centro', operation:'Arriendo', type:'Departamento', comuna:'Rancagua', sector:'Manzanal', price:'$650.000 / mes', beds:2, baths:2, parking:1, area:'86 m² totales', status:'Disponible', image:'depto-demo.png', mapQuery:'Manzanal, Rancagua, O’Higgins, Chile', description:'Un departamento de líneas simples, con servicios y conectividad cotidiana a pocos minutos. Visual referencial de una ficha demostrativa.'},
  {slug:'casa-santa-cruz', code:'MJN-009', title:'Casa familiar entre viñas y jardín', operation:'Venta', type:'Casa', comuna:'Santa Cruz', sector:'Colchagua', price:'UF 16.500', beds:4, baths:4, parking:2, area:'610 m² terreno', status:'Reservada', image:'casa-demo.png', mapQuery:'Santa Cruz, Colchagua, O’Higgins, Chile', description:'Espacios generosos, áreas exteriores y una relación natural con el entorno de Colchagua. Visual referencial de una ficha demostrativa.'},
  {slug:'oficina-rancagua', code:'MJN-006', title:'Oficina habilitada con luz natural', operation:'Arriendo', type:'Oficina', comuna:'Rancagua', sector:'Centro', price:'UF 25 / mes', beds:null, baths:2, parking:2, area:'128 m² útiles', status:'Disponible', image:'oficina-demo.png', mapQuery:'Centro, Rancagua, O’Higgins, Chile', description:'Una planta eficiente y luminosa para equipos que valoran ubicación y presencia en el centro de Rancagua. Visual referencial de una ficha demostrativa.'},
  {slug:'depto-san-fernando', code:'MJN-003', title:'Departamento sereno con vista despejada', operation:'Venta', type:'Departamento', comuna:'San Fernando', sector:'Centro', price:'UF 4.950', beds:2, baths:2, parking:1, area:'104 m² totales', status:'Vendida', image:'depto-demo.png', mapQuery:'San Fernando, O’Higgins, Chile', description:'Una ficha demostrativa de un departamento con luz natural y conectividad para la vida diaria en San Fernando.'},
];

export const getProperty = slug => properties.find(p => p.slug === slug);
export const wa = (message) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
