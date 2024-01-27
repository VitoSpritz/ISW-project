<template>
    <h2>Login</h2>
    <form action="#" method="POST">
        <ul>
            <li>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" />
            </li>
            <li>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
            </li>
            <li>
                <input type="submit" name="submit" value="Invia" />
            </li>
        </ul>
    </form>
    <p>Se non sei registrato fallo <router-link to="/register" style="text-decoration: none; color: blue; cursor: pointer;">qui</router-link></p>
    
</template>

<style scoped>
    
    form{
        height: auto;
    }

    p{
        text-align: center;
        font-size: 20px;

    }
</style>