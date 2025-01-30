const { createApp } = Vue;

createApp({
    data() {
        return {
            alumnos: [],
            codigo: '',
            nombre: '',
            direccion: '',
            municipio: '',
            departamento: '',
            telefono: '',
            fechadenacimiento: '',
            sexo: '',
            email: '',
            busqueda: ''
        };
    },
    computed: {
        alumnosFiltrados() { 
            if (!this.busqueda) {
                return this.alumnos;
            }
            return this.alumnos.filter(alumno =>
                alumno.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                alumno.codigo.toLowerCase().includes(this.busqueda.toLowerCase())
            );
        }
    },
    methods: {
        eliminarAlumno(alumno) {
            if (confirm(`¿Está seguro de eliminar el alumno ${alumno.nombre}?`)) {
                localStorage.removeItem(alumno.codigo);
                this.listarAlumnos();
            }
        },
        verAlumno(alumno) {
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.municipio = alumno.municipio;
            this.departamento = alumno.departamento;
            this.telefono = alumno.telefono;
            this.fechadenacimiento = alumno.fechadenacimiento;
            this.sexo = alumno.sexo;
            this.email = alumno.email;
        },
        guardarAlumno() {
            let alumno = {
                codigo: this.codigo,
                nombre: this.nombre,
                direccion: this.direccion,
                municipio: this.municipio,
                departamento: this.departamento,
                telefono: this.telefono,
                fechadenacimiento: this.fechadenacimiento,
                sexo: this.sexo,
                email: this.email
            };
            localStorage.setItem(this.codigo, JSON.stringify(alumno));
            this.listarAlumnos();
        },
        listarAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let clave = localStorage.key(i);
                let valor = localStorage.getItem(clave);
                this.alumnos.push(JSON.parse(valor));
            }
        }
    },
    created() {
        this.listarAlumnos();
    }
}).mount('#app');