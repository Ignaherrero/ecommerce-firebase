import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { signInWithGoogle } from "../firebase/firebase-config";

export const Login = () => {
  const handleGoogleSignInitiate = async () => {
    try {
      const user = await signInWithGoogle();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container minH="100vh">
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight="100vh"
      >
        <Box height="300px" width="100%" boder="1px solid grey" boxShadow="lg">
          <Text textAlign="center" marginTop={10}>
            Login
          </Text>
          <Flex justifyContent="center" marginTop={10}>
            <Button onClick={handleGoogleSignInitiate}>
              Iniciar con google
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};
