import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  ListItem,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useForm } from "react-hook-form";

import { getDownloadURL } from "firebase/storage";
import { ContextLogin } from "../../context/login-context";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ModalEditProducts } from "../../comps/editProducts";
import { Login } from "../../comps/login";
import { ListsAndEditProducts } from "../../comps/listsProducts";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { login: isLogin, setLogin } = useContext(ContextLogin);

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else if (isLogin) {
      setIsLoading(false);
      const getData = async () => {
        const docRef = await getDocs(query(collection(db, "article")));
        setProducts(docRef.docs.map((item) => item.data()));
      };
      getData();
      setIsLoading(false);
    }
  }, [isLoading, isDelete]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("entro");
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
            <ListsAndEditProducts products={products}/>
            <ModalEditProducts products={products} isLoading />
            
          </Container>
          <Button onClick={handleLogOut}>Cerrar sesion</Button>
        </VStack>
      ) : (
        <Login />
      )}
    </>
  );
}
