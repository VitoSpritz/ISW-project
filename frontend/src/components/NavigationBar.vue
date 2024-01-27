<template>
    <navbar>
        <div>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li>Stanze</li>
                <li>Login</li>
            </ul>
        </div>
    </navbar>
</template>

<style>
div{
    background-color:lightgray;
}

ul{
    max-width: 100%;
    justify-content: flex-end;
    display: flex;
    list-style: none; 
}

li{
    font-size: 25px;
    text-align: center;
    decoration: none;
    width: 10%;
}
</style>