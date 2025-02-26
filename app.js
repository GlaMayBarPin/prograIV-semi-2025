const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {

        const activeTab = ref('autores');
        
 
        const notification = ref({
            show: false,
            message: '',
            type: 'success'
        });
        
 
        const autores = ref([]);
        const editingAutor = ref({
            idAutor: null,
            codigo: '',
            nombre: '',
            pais: '',
            telefono: ''
        });
        const searchAutor = ref('');
        const filterPais = ref('');
        
    
        const libros = ref([]);
        const editingLibro = ref({
            idLibro: null,
            idAutor: '',
            isbn: '',
            titulo: '',
            editorial: '',
            edicion: 1
        });
        const searchLibro = ref('');
        const filterEditorial = ref('');
        
       
        onMounted(() => {
            loadData();
        });
        
 
        const showNotification = (message, type = 'success') => {
            notification.value = {
                show: true,
                message,
                type
            };
            
        
            setTimeout(() => {
                notification.value.show = false;
            }, 3000);
        };
  
        const loadData = () => {
           
            const savedAutores = localStorage.getItem('autores');
            if (savedAutores) {
                autores.value = JSON.parse(savedAutores);
            }
            
      
            const savedLibros = localStorage.getItem('libros');
            if (savedLibros) {
                libros.value = JSON.parse(savedLibros);
            }
        };
        
   
        const saveAutor = () => {
            if (editingAutor.value.idAutor === null) {
                
                const newId = autores.value.length > 0 
                    ? Math.max(...autores.value.map(a => a.idAutor)) + 1 
                    : 1;
                const newAutor = {
                    ...editingAutor.value,
                    idAutor: newId
                };
                autores.value.push(newAutor);
                showNotification('Autor guardado correctamente', 'success');
            } else {
           
                const index = autores.value.findIndex(a => a.idAutor === editingAutor.value.idAutor);
                if (index !== -1) {
                    autores.value[index] = { ...editingAutor.value };
                    showNotification('Autor actualizado correctamente', 'success');
                }
            }
            
          
            localStorage.setItem('autores', JSON.stringify(autores.value));
            
        
            resetAutorForm();
        };
        
        const editAutor = (autor) => {
            editingAutor.value = { ...autor };
        };
        
        const deleteAutor = (id) => {
            if (confirm('¿Está seguro de eliminar este autor? También se eliminarán todos sus libros asociados.')) {
             
                autores.value = autores.value.filter(a => a.idAutor !== id);
                
               
                libros.value = libros.value.filter(l => l.idAutor !== id);
                
                
                localStorage.setItem('autores', JSON.stringify(autores.value));
                localStorage.setItem('libros', JSON.stringify(libros.value));
                
                showNotification('Autor eliminado correctamente', 'error');
            }
        };
        
        const resetAutorForm = () => {
            editingAutor.value = {
                idAutor: null,
                codigo: '',
                nombre: '',
                pais: '',
                telefono: ''
            };
        };
    
        const saveLibro = () => {
            if (editingLibro.value.idLibro === null) {
            
                const newId = libros.value.length > 0 
                    ? Math.max(...libros.value.map(l => l.idLibro)) + 1 
                    : 1;
                const newLibro = {
                    ...editingLibro.value,
                    idLibro: newId
                };
                libros.value.push(newLibro);
                showNotification('Libro guardado correctamente', 'success');
            } else {
                
                const index = libros.value.findIndex(l => l.idLibro === editingLibro.value.idLibro);
                if (index !== -1) {
                    libros.value[index] = { ...editingLibro.value };
                    showNotification('Libro actualizado correctamente', 'success');
                }
            }
            
          
            localStorage.setItem('libros', JSON.stringify(libros.value));
            
       
            resetLibroForm();
        };
        
        const editLibro = (libro) => {
            editingLibro.value = { ...libro };
        };
        
        const deleteLibro = (id) => {
            if (confirm('¿Está seguro de eliminar este libro?')) {
                libros.value = libros.value.filter(l => l.idLibro !== id);
                localStorage.setItem('libros', JSON.stringify(libros.value));
                showNotification('Libro eliminado correctamente', 'error');
            }
        };
        
        const resetLibroForm = () => {
            editingLibro.value = {
                idLibro: null,
                idAutor: '',
                isbn: '',
                titulo: '',
                editorial: '',
                edicion: 1
            };
        };
        
        const getAutorName = (idAutor) => {
            const autor = autores.value.find(a => a.idAutor === idAutor);
            return autor ? autor.nombre : 'Desconocido';
        };
        
      
        const filteredAutores = computed(() => {
            return autores.value.filter(autor => {
                const matchesSearch = searchAutor.value === '' || 
                    autor.codigo.toLowerCase().includes(searchAutor.value.toLowerCase()) ||
                    autor.nombre.toLowerCase().includes(searchAutor.value.toLowerCase()) ||
                    autor.pais.toLowerCase().includes(searchAutor.value.toLowerCase());
                
                const matchesPais = filterPais.value === '' || autor.pais === filterPais.value;
                
                return matchesSearch && matchesPais;
            });
        });
        
        const filteredLibros = computed(() => {
            return libros.value.filter(libro => {
                const matchesSearch = searchLibro.value === '' || 
                    libro.isbn.toLowerCase().includes(searchLibro.value.toLowerCase()) ||
                    libro.titulo.toLowerCase().includes(searchLibro.value.toLowerCase());
                
                const matchesEditorial = filterEditorial.value === '' || libro.editorial === filterEditorial.value;
                
                return matchesSearch && matchesEditorial;
            });
        });
        
        const paises = computed(() => {
            const paisesUnicos = new Set(autores.value.map(a => a.pais));
            return [...paisesUnicos];
        });
        
        const editoriales = computed(() => {
            const editorialesUnicas = new Set(libros.value.map(l => l.editorial));
            return [...editorialesUnicas];
        });
        
        return {
            activeTab,
            notification,
            autores,
            libros,
            editingAutor,
            editingLibro,
            searchAutor,
            searchLibro,
            filterPais,
            filterEditorial,
            filteredAutores,
            filteredLibros,
            paises,
            editoriales,
            saveAutor,
            editAutor,
            deleteAutor,
            resetAutorForm,
            saveLibro,
            editLibro,
            deleteLibro,
            resetLibroForm,
            getAutorName
        };
    }
}).mount('#app');