import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { nanoid } from "nanoid";

export const ListsAndEditProducts = ({ products, isLoading }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDeleteAnArticle = async (product) => {
    setIsDelete(true);
    await deleteDoc(doc(db, "article", product));
    setIsDelete(false);
  };

  const handleEditeAnArticle = async ({ product, price, urlImage }) => {
    onOpen();
    setValue("product", product);
    setValue("price", price);
  };

  return (
    <>
      {isLoading ? (
        <p>Cargando...</p>
      ) : 
      (
        <List
          styleType="none"
          spacing={2}
          marginTop={4}
          marginRight="auto"
          marginLeft="auto"
          width="80%"
        >
          <Text as="h1" textAlign="center" marginTop={6}>
            Lista de productos
          </Text>

          {products.map((product) => {
            return (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={nanoid()}
              >
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  height="70px"
                  borderRadius="sm"
                >
                  <Image
                    src={product.urlImage}
                    maxWidth="100px"
                    maxHeight="90px"
                    width="auto"
                    height="auto"
                    objectFit="contain"
                  />
                  <ListItem key={product.product} letterSpacing={1}>
                    {product.product}{" "}
                    {parseInt(product.price).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </ListItem>
                  <ButtonGroup>
                    <Button
                      size="xs"
                      onClick={() => handleDeleteAnArticle(product.product)}
                      isDisabled={isDelete}
                    >
                      X
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => handleEditeAnArticle(product)}
                      isDisabled={isDelete}
                    >
                      E
                    </Button>
                  </ButtonGroup>
                </Flex>
                <Divider orientation="horizontal" border="1px" />
              </motion.div>
            );
          })}
        </List>
      )}
    </>
  );
};
