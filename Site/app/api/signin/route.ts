// export async function OPTIONS(request: Request) {
//   const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   };
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

export async function GET(request: Request) {
  let message = {msg: "who tf is giga niga"};
  return Response.json(message, {
    status: 200,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    // },
  })
}