from flask import Flask, send_file, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Configuración de la base de datos
DATABASE = 'database.db'

def init_db():
    """Inicializar la base de datos"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Tabla de contactos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT,
            mensaje TEXT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de productos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            categoria TEXT,
            imagen TEXT,
            stock INTEGER DEFAULT 0
        )
    ''')
    
    # Insertar productos de ejemplo
    cursor.execute('SELECT COUNT(*) FROM productos')
    if cursor.fetchone()[0] == 0:
        productos_ejemplo = [
            ('Teclado Mecánico RGB', 'Teclado gaming', 150.00, 'accesorios', 'teclado.jpg', 10),
            ('Mouse Inalámbrico', 'Mouse Bluetooth', 80.00, 'accesorios', 'mouse.jpg', 15),
        ]
        cursor.executemany('INSERT INTO productos VALUES (NULL, ?, ?, ?, ?, ?, ?)', productos_ejemplo)
    
    conn.commit()
    conn.close()

# Función para servir archivos HTML
def servir_html(nombre_archivo):
    try:
        return send_file(nombre_archivo)
    except FileNotFoundError:
        return "Archivo no encontrado", 404

# Rutas principales
@app.route('/')
def index():
    return servir_html('index.html')

@app.route('/contacto')
def contacto():
    return servir_html('contacto.html')

@app.route('/carrito')
def carrito():
    return servir_html('carrito.html')

@app.route('/blog')
def blog():
    return servir_html('blog.html')

@app.route('/galeria')
def galeria():
    return servir_html('galeria.html')

@app.route('/testimonios')
def testimonios():
    return servir_html('testimonios.html')

@app.route('/admin.html')
def admin():
    return servir_html('admin.html')

# Rutas de servicios
@app.route('/reparacion-pc')
def reparacion_pc():
    return servir_html('reparacion-pc.html')

@app.route('/camaras')
def camaras():
    return servir_html('camaras.html')

@app.route('/accesorios')
def accesorios():
    return servir_html('accesorios.html')

@app.route('/celulares')
def celulares():
    return servir_html('celulares.html')

# API para formulario de contacto
@app.route('/api/contacto', methods=['POST'])
def api_contacto():
    try:
        data = request.json
        
        if not data.get('nombre') or not data.get('email') or not data.get('mensaje'):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contactos (nombre, email, telefono, mensaje)
            VALUES (?, ?, ?, ?)
        ''', (data['nombre'], data['email'], data.get('telefono', ''), data['mensaje']))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Mensaje recibido correctamente'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Servir archivos estáticos (CSS, JS, imágenes)
@app.route('/<path:filename>')
def servir_estatico(filename):
    # Verificar si el archivo existe
    if os.path.exists(filename):
        return send_file(filename)
    
    # Si no existe, intentar en subcarpetas comunes
    carpetas = ['', 'css/', 'js/', 'img/']
    for carpeta in carpetas:
        ruta = carpeta + filename if carpeta else filename
        if os.path.exists(ruta):
            return send_file(ruta)
    
    return "Archivo no encontrado", 404

# Ruta para probar la base de datos
@app.route('/api/test-db')
def test_db():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Contar contactos
        cursor.execute('SELECT COUNT(*) FROM contactos')
        contactos_count = cursor.fetchone()[0]
        
        # Contar productos
        cursor.execute('SELECT COUNT(*) FROM productos')
        productos_count = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'status': 'ok',
            'contactos': contactos_count,
            'productos': productos_count,
            'mensaje': 'Base de datos funcionando correctamente'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Inicializar base de datos
    init_db()
    
    print("=" * 60)
    print("GOTOTECH - SISTEMA WEB")
    print("=" * 60)
    print("Servidor iniciado en: http://localhost:5000")
    print("")
    print("Rutas disponibles:")
    print("  • Página principal:      http://localhost:5000/")
    print("  • Contacto:              http://localhost:5000/contacto")
    print("  • Carrito:               http://localhost:5000/carrito")
    print("  • Blog:                  http://localhost:5000/blog")
    print("  • Galería:               http://localhost:5000/galeria")
    print("  • Testimonios:           http://localhost:5000/testimonios")
    print("  • Admin:                 http://localhost:5000/admin.html")
    print("  • API Contacto:          http://localhost:5000/api/contacto")
    print("  • Test DB:               http://localhost:5000/api/test-db")
    print("")
    print("Base de datos: database.db (creada automáticamente)")
    print("=" * 60)
    
    app.run(debug=True, port=5000)