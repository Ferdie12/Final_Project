import web from "./src/application/web.js"

web.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))