import React, { useContext, useEffect, useState } from "react";
import { Button, Container, useDisclosure, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ContextLogin } from "../../context/login-context";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ModalEditProducts } from "../../comps/editProducts";
import { Login } from "../../comps/login";
import { ListsAndEditProducts } from "../../comps/listsProducts";

export default function Productos() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { login: isLogin, setLogin } = useContext(ContextLogin);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setLogin(true);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setLogin(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      {isLogin ? (
        <VStack>
          <Container>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={onOpen}
              marginTop={6}
              width="100%"
            >
              Agregar producto
            </Button>
            <ListsAndEditProducts
              isOpen
              onOpen={onOpen}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setValue={setValue}
              register={register}
              handleSubmit={handleSubmit}
            />
            <ModalEditProducts
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isOpen={isOpen}
              onClose={onClose}
              setValue={setValue}
              handleSubmit={handleSubmit}
              register={register}
              reset={reset}
            />
          </Container>
          <Button onClick={handleLogOut}>Cerrar sesion</Button>
        </VStack>
      ) : (
        <Login />
      )}
    </>
  );
}
