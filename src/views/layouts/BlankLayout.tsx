
// ** Mui
import { Box, BoxProps, styled } from "@mui/material";

// **Next
import { NextPage } from "next";

//Đây là file code Layout cho những page ko dùng Layout mặc định(UserLayout)
type TProps = {
    children: React.ReactNode
}
const BlackLayoutWrapper = styled(Box)<BoxProps>(({theme}) => ({
    height: "100vh"
}))
const BlackLayout: NextPage<TProps> = ({children})=>{
    return (
        <BlackLayoutWrapper>
            <Box sx={{overflow:"hidden", minHeigh:"100vh"}}>{children}</Box>
        </BlackLayoutWrapper>
    )
}

export default BlackLayout