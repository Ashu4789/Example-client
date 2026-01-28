function ProductList({products}) {
    return (
        <>
        <h1>Product List</h1>
        {products.map((product) => (
            <div style={{border: "1px solid black", margin: "10px", padding: "10px"}} key={product.id * 2 + 45}>
                <p>
                    Product ID: {product.id}
                </p>
                <h2>{product.name}</h2>
                <p>Price: {product.price}</p>
                <p>Category: {product.category}</p>
            </div>
        ))}
        </>
    );
}
export default ProductList; 