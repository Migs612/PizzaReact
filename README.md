# 🍕 Pizza React

## Descripción

Pizza React es una simulación de una tienda online de pizzas. La aplicación permite explorar un menú de pizzas, bebidas y postres, simular pedidos completos con datos ficticios, añadir direcciones de entrega y registrar tarjetas de pago falsas para completar el flujo de compra.

El proyecto está desplegado con **Docker**, utilizando una arquitectura de dos contenedores (aplicación + base de datos MySQL) comunicados mediante una red Docker interna.

## Instrucciones para ejecutar el sistema

### Levantar los contenedores

```bash
docker compose up --build
```

Una vez que los contenedores estén en ejecución, abrir el navegador en:

**http://localhost:3001**

### Detener los contenedores

```bash
docker compose down
```

### Reiniciar con base de datos limpia

```bash
docker compose down -v
docker compose up --build
```
