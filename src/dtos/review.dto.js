export const userReviewDTO = (body) => {
    return{
        rate: body.rate,
        content: body.content
    }
}