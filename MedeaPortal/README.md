# Medea Mind - Chatbot Clínico para Psicólogos

## Descripción

Medea Mind es una aplicación web fullstack diseñada como asistente clínico especializado para profesionales de la psicología. La aplicación permite a los psicólogos realizar consultas clínicas y recibir orientación basada en evidencia científica a través de una interfaz de chat intuitiva.

## Tecnologías Utilizadas

### Frontend
- **React 18** con **TypeScript** - Framework principal para la interfaz de usuario
- **Vite** - Herramienta de build y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos utilitarios
- **Shadcn/ui** - Componentes de UI accesibles basados en Radix UI
- **TanStack Query (React Query)** - Gestión de estado del servidor y caché
- **Wouter** - Enrutamiento ligero del lado del cliente
- **React Hook Form** + **Zod** - Manejo y validación de formularios

### Backend
- **Node.js** con **Express.js** - Servidor web y API REST
- **TypeScript** - Tipado estático y mejor experiencia de desarrollo
- **OpenAI API** - Integración con GPT-4o para respuestas clínicas especializadas
- **Drizzle ORM** - ORM type-safe para operaciones de base de datos
- **PostgreSQL** - Base de datos persistente con Neon serverless

### Herramientas de Desarrollo
- **ESBuild** - Bundling del código del servidor
- **Drizzle Kit** - Gestión de esquemas de base de datos
- **Date-fns** - Manipulación de fechas con localización en español

## Estructura de la Solución

### Arquitectura General
La aplicación sigue una arquitectura fullstack moderna con separación clara entre frontend y backend:

```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes UI reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── lib/          # Utilidades y configuración
│   │   └── hooks/        # Custom hooks
├── server/               # Backend Express
│   ├── services/         # Servicios (OpenAI)
│   ├── routes.ts         # Definición de rutas API
│   ├── storage.ts        # Capa de persistencia
│   └── index.ts          # Punto de entrada del servidor
├── shared/               # Esquemas y tipos compartidos
└── components.json       # Configuración de Shadcn/ui
```

### Componentes Principales

**Frontend:**
- **ChatInterface**: Componente principal que maneja la lógica del chat
- **MessageList**: Renderiza los mensajes con diseño responsive
- **MessageInput**: Input con plantillas predefinidas para consultas clínicas
- **ConversationSidebar**: Historial y navegación entre conversaciones
- **Header**: Barra superior con información del usuario

**Backend:**
- **API REST**: Endpoints para chat, conversaciones y usuarios
- **OpenAI Service**: Integración especializada para respuestas clínicas
- **Storage Interface**: Abstracción para operaciones de base de datos
- **Validación**: Esquemas Zod para validación de entrada

### Base de Datos
El esquema incluye tres entidades principales:
- **Users**: Perfiles de profesionales con especialidades
- **Conversations**: Sesiones de chat con títulos automáticos
- **Messages**: Mensajes individuales con roles (user/assistant)

## Decisiones Técnicas

### 1. **Arquitectura Fullstack con TypeScript**
Elegí usar TypeScript en todo el stack para garantizar type-safety y mejor experiencia de desarrollo. Los tipos compartidos en `shared/schema.ts` aseguran consistencia entre frontend y backend.

### 2. **React Query para Estado del Servidor**
Implementé TanStack Query para manejar el estado del servidor, proporcionando caché automático, actualizaciones optimistas y sincronización en tiempo real. Esto mejora significativamente la UX del chat.

### 3. **Shadcn/ui + Tailwind CSS**
Opté por esta combinación porque ofrece componentes accesibles y personalizables sin sacrificar flexibilidad. Los componentes son copiables y modificables según necesidades específicas.

### 4. **PostgreSQL con Drizzle ORM**
Migré el almacenamiento a PostgreSQL usando Neon serverless para persistencia real. Drizzle ORM proporciona type-safety y excelente integración con TypeScript, facilitando consultas complejas y migraciones.

### 5. **Integración OpenAI Especializada**
Configuré el modelo GPT-4o con un prompt system especializado en psicología clínica que proporciona:
- Respuestas basadas en evidencia científica
- Orientación en terapias específicas (TCC, ACT, DBT)
- Evaluación y diagnóstico psicológico
- Intervención en crisis
- Disclaimers profesionales apropiados

### 6. **Plantillas de Consulta Predefinidas**
Implementé botones de plantillas para consultas comunes (diagnóstico diferencial, estrategias terapéuticas, evaluación, crisis) que facilitan el uso y aseguran consultas bien estructuradas.

### 7. **UX Optimizada para Profesionales**
- Interfaz limpia y profesional
- Indicadores de estado de IA
- Funciones de exportación de conversaciones
- Historial persistente
- Feedback en tiempo real

## Instrucciones de Ejecución

### Prerrequisitos
- Node.js 18+ 
- Clave API de OpenAI

### Ejecución Local

1. **Clona el repositorio**
```bash
git clone <https://medea-portal-hello890.replit.app/>
cd medea-mind
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
# Crea archivo .env en la raíz del proyecto
echo "OPENAI_API_KEY=tu_clave_api_aqui" > .env
```

4. **Inicia la aplicación**
```bash
npm run dev
```

5. **Accede a la aplicación**
- Abre tu navegador en `http://localhost:5000`
- Usuario demo: Dr. Ana García (Psicología Clínica)

### Ejecución con Docker (Opcional)

```bash
# Construir imagen
docker build -t medea-mind .

# Ejecutar contenedor
docker run -p 5000:5000 -e OPENAI_API_KEY=tu_clave_api medea-mind
```

### Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run db:push  # Aplicar cambios de esquema DB
```

## Funcionalidades Implementadas

### Características Principales
✅ **Chat en tiempo real** con OpenAI GPT-4o  
✅ **Historial persistente** de conversaciones  
✅ **Plantillas predefinidas** para consultas clínicas  
✅ **Títulos automáticos** para conversaciones  
✅ **Export de conversaciones** en formato texto  
✅ **Interfaz responsive** para desktop y móvil  
✅ **Indicadores de estado** (IA activa, escribiendo...)  
✅ **Validación de entrada** con límites de caracteres  
✅ **Gestión de errores** con notificaciones toast  

### API Endpoints
- `POST /api/chat` - Enviar mensaje y recibir respuesta IA
- `GET /api/conversations` - Obtener historial de conversaciones
- `GET /api/conversations/:id/messages` - Mensajes de conversación específica
- `GET /api/user` - Información del usuario actual

### Características de Seguridad
- Validación de entrada con Zod schemas
- Límites de longitud de mensajes (2000 caracteres)
- Manejo seguro de claves API
- Disclaimers profesionales en respuestas IA

## URL de Despliegue

La aplicación está desplegada y funcionando en Replit:
**URL**:https://medea-portal-hello890.replit.app

## Estimación de Tiempo

**Tiempo total dedicado: Aproximadamente 4-5 horas**

### Desglose:
- **Análisis y diseño de arquitectura**: 45 minutos
- **Configuración del proyecto y dependencias**: 30 minutos  
- **Desarrollo del backend (API + OpenAI)**: 90 minutos
- **Desarrollo del frontend (componentes + UI)**: 120 minutos
- **Integración y testing**: 45 minutos
- **Documentación y refinamiento**: 30 minutos

## Próximos Pasos (Mejoras Futuras)

- **Autenticación JWT** para múltiples usuarios
- **Base de datos PostgreSQL** para persistencia real
- **Sistema de roles** (psicólogos, supervisores, administradores)
- **Exportación avanzada** (PDF, análisis de sesiones)
- **Integración con calendarios** para seguimiento de pacientes
- **Analytics** de uso y eficacia terapéutica
- **Modo offline** con sincronización posterior
- **Temas personalizables** y configuración de UI

