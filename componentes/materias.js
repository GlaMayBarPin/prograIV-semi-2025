    
 const materia = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            accion: 'nuevo',
            materias: [],
            idMateria: '',
            codigo: '',
            nombre: '',
            uv: '',
        }
    },
    methods: {
        eliminarMateria(materia) {
            alertify.confirm('Eliminar Materia', `¿Esta seguro de eliminar el materia ${materia.nombre}?`, () => {
                db.materias.delete(materia.idMateria);
                this.listarMaterias();
                alertify.success(`Materia ${materia.nombre} eliminado`);
            }, () => { });
        },
        modificarMateria(materia) {
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            this.codigo = materia.codigo;
            this.nombre = materia.nombre;
            this.uv = materia.uv;
        },
        guardarMateria() {
            let materia = {
                codigo: this.codigo,
                nombre: this.nombre,
                uv: this.uv
            };
            if (this.accion == 'modificar') {
                materia.idMateria = this.idMateria;
            }
            db.materias.put(materia);
            this.nuevoMateria();
            this.listarMaterias();
        },
        async listarMaterias() {
            this.materias = await db.materias.filter(materia => materia[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
        nuevoMateria() {
            this.accion = 'nuevo';
            this.idMateria = '';
            this.codigo = '';
            this.nombre = '';
            this.uv = '';
        }
    },
    created() {
        this.listarMaterias();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmMateria" name="frmMateria" @submit.prevent="guardarMateria">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Materias</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="codigo" type="text" name="txtCodigoMateria" id="txtCodigoMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" name="txtNombreMateria" id="txtNombreMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">UV</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="uv" type="text" name="txtUVMateria" id="txtUVMateria" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-6">
                <table class="table table-sm table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>BUSCAR POR</th>
                            <th>
                                <select v-model="buscarTipo" class="form-control">
                                    <option value="codigo">CODIGO</option>
                                    <option value="nombre">NOMBRE</option>
                                    <option value="uv">UV</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarMaterias()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>UV</th>  
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="materia in materias" @click="modificarMateria(materia)" :key="materia.idMateria">
                            <td>{{ materia.codigo }}</td>
                            <td>{{ materia.nombre }}</td>
                            <td>{{ materia.uv }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarMateria(materia)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};