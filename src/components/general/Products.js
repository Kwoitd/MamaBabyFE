import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { allProductApi } from "../../api/ProductAPI";
import { commentByProductIdApi, allCommentApi } from "../../api/CommentAPI";
import { Star, StarHalf, StarOutline } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Pagination,
  Radio,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClearAll, KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";
import { addToCart } from "../../redux/CartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Products() {
  const navigate = useNavigate();
  window.document.title = "Products";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState([]);
  const [comment, setComment] = useState([]);
  const [sortPrice, setSortPrice] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const keyword = state?.keyword;
  const typeWHOLESALE = "WHOLESALE";
  console.log(product);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes, commentRes] =
        await Promise.all([
          allAgeApi(),
          allBrandApi(),
          allCategorytApi(),
          allProductApi({
            keyword: keyword,
            sort_price: sortPrice,
            type: typeWHOLESALE,
            age_id: ageFilter,
            brand_id: brandFilter,
            category_id: categoryFilter,
            page: currentPage - 1,
          }),
          allCommentApi(),
        ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const commentData = commentRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);

      const ageMap = ageData.reduce((x, item) => {
        x[item.id] = item.rangeAge;
        return x;
      }, {});
      setAgeMap(ageMap);

      const brandMap = brandData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setBrandMap(brandMap);

      const categoryMap = categoryData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setCategoryMap(categoryMap);

      setComment(commentData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchData();
  }, [keyword, sortPrice, ageFilter, brandFilter, categoryFilter, currentPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleSortChange = (e, sortPrice) => {
    if (sortPrice !== null) {
      setSortPrice(sortPrice);
    }
  };

  const handleAgeChange = (id) => {
    setAgeFilter((prev) => (prev === id ? null : id));
    // setLoading(true);
    setCurrentPage(1);
  };

  const handleBrandChange = (id) => {
    setBrandFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handleCategoryChange = (id) => {
    setCategoryFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setAgeFilter(null);
    setBrandFilter(null);
    setCategoryFilter(null);
  };

  const handleAddToCart = (index) => {
    if (product.products[index].status === "OUT OF STOCK") {
      toast.error(`Cannot add this product to cart`, {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }
    if (product.products[index].status === "IN STOCK") {
      toast.info(`${product.products[index].name} x 1 was added to cart`, {
        position: "top-right",
        autoClose: 1000,
      });
    }
    dispatch(
      addToCart({
        product: {
          id: product.products[index].id,
          name: product.products[index].name,
          price: product.products[index].price,
          point: product.products[index].point,
          remain: product.products[index].remain,
          type: product.products[index].type,
          store_id: product.products[index].store_id,
          image_url: product.products[index].image_url,
        },
        quantity: 1,
      })
    );
  };

  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return (
      <div
        style={{
          backgroundColor: "#f5f7fd",
          padding: "20px",
        }}
      >
        <Container sx={{ my: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Breadcrumbs separator=">" sx={{ color: "black" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    transition: "color 0.2s ease-in-out",
                    fontSize: 20,
                    fontWeight: "bold",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Typography
                sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
              >
                Products
              </Typography>
            </Breadcrumbs>
            <ToggleButtonGroup
              value={sortPrice}
              exclusive
              onChange={handleSortChange}
              variant="outlined"
              sx={{
                mt: 0.5,
                height: "40px",
                "& .MuiToggleButton-root": {
                  color: "black",
                  border: "1px solid #ff469e",
                  fontSize: "1rem",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#ff469e",
                    color: "white",
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                    },
                  },
                },
              }}
            >
              <ToggleButton
                value=""
                sx={{
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                }}
              >
                All
              </ToggleButton>
              <ToggleButton
                value="ASC"
                sx={{
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderLeft: "1px solid #ff469e",
                  borderRight: "1px solid #ff469e",
                  fontSize: "1rem",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                }}
              >
                Low - High
              </ToggleButton>
              <ToggleButton
                value="DESC"
                sx={{
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                }}
              >
                High - Low
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Container>
        <Container>
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid
              item
              sm={12}
              md={3}
              sx={{
                border: "2px solid #ff469e",
                borderRadius: "20px",
                backgroundColor: "white",
                my: 3,
              }}
            >
              <Box sx={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      flexGrow: 1,
                      textAlign: "center",
                    }}
                  >
                    Filters
                  </Typography>
                  {(ageFilter || brandFilter || categoryFilter) && (
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "10px",
                        fontSize: 16,
                        fontWeight: "bold",
                        mr: 2,
                        padding: "0.25rem 0.5rem",
                        boxShadow: "none",
                        transition:
                          "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                          border: "1px solid white",
                        },
                      }}
                    >
                      <ClearAll />
                    </Button>
                  )}
                </div>
                <Grid container spacing={2}>
                  {/* Age Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Age
                    </Typography>
                    <Grid container spacing={1}>
                      {age.map((item) => (
                        <Grid
                          xs={12}
                          sm={6}
                          md={12}
                          lg={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={ageFilter === item.id}
                                onChange={() => handleAgeChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.rangeAge}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Brand Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Brand
                    </Typography>
                    <Grid container spacing={1}>
                      {brand.map((item) => (
                        <Grid
                          xs={12}
                          sm={6}
                          md={12}
                          lg={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={brandFilter === item.id}
                                onChange={() => handleBrandChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Category Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Category
                    </Typography>
                    <Grid container spacing={1}>
                      {category.map((item) => (
                        <Grid
                          item
                          xs={12}
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={categoryFilter === item.id}
                                onChange={() => handleCategoryChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Loading Spinner */}
            <Grid item sm={12} md={9}>
              <Box
                sx={{
                  backgroundColor: "#f5f7fd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15%",
                }}
              >
                <CircularProgress sx={{ color: "#ff469e" }} size={90} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Breadcrumbs separator=">" sx={{ color: "black" }}>
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                sx={{
                  color: "black",
                  transition: "color 0.2s ease-in-out",
                  fontSize: 20,
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Home
              </Typography>
            </Link>
            <Typography
              sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
            >
              Products
            </Typography>
          </Breadcrumbs>
          <ToggleButtonGroup
            value={sortPrice}
            exclusive
            onChange={handleSortChange}
            variant="outlined"
            sx={{
              mt: 0.5,
              height: "40px",
              "& .MuiToggleButton-root": {
                color: "black",
                border: "1px solid #ff469e",
                fontSize: "1rem",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  fontWeight: "600",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                  },
                },
              },
            }}
          >
            <ToggleButton
              value=""
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderRadius: "20px",
                fontSize: "1rem",
                boxShadow: "none",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
              }}
            >
              All
            </ToggleButton>
            <ToggleButton
              value="ASC"
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderLeft: "1px solid #ff469e",
                borderRight: "1px solid #ff469e",
                fontSize: "1rem",
                boxShadow: "none",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
              }}
            >
              Low - High
            </ToggleButton>
            <ToggleButton
              value="DESC"
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderRadius: "20px",
                fontSize: "1rem",
                boxShadow: "none",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
              }}
            >
              High - Low
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Container>
      <Container>
        <Grid container spacing={3}>
          {/* Filters */}
          <Grid
            item
            sm={12}
            md={3}
            sx={{
              border: "2px solid #ff469e",
              borderRadius: "20px",
              backgroundColor: "white",
              my: 3,
            }}
          >
            <Box sx={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                >
                  Filters
                </Typography>
                {(ageFilter || brandFilter || categoryFilter) && (
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "10px",
                      fontSize: 16,
                      fontWeight: "bold",
                      mr: 2,
                      padding: "0.25rem 0.5rem",
                      boxShadow: "none",
                      transition:
                        "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                        border: "1px solid white",
                      },
                    }}
                  >
                    <ClearAll />
                  </Button>
                )}
              </div>
              <Grid container spacing={2}>
                {/* Age Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Age
                  </Typography>
                  <Grid container spacing={1}>
                    {age.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={ageFilter === item.id}
                              onChange={() => handleAgeChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.rangeAge}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Brand Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Brand
                  </Typography>
                  <Grid container spacing={1}>
                    {brand.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={brandFilter === item.id}
                              onChange={() => handleBrandChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Category Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Category
                  </Typography>
                  <Grid container spacing={1}>
                    {category.map((item) => (
                      <Grid
                        item
                        xs={12}
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={categoryFilter === item.id}
                              onChange={() => handleCategoryChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* List Products */}
          <Grid item sm={12} md={9}>
            <Grid container spacing={3}>
              {product?.products?.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", marginTop: 8, color: "#ff469e" }}
                  >
                    There's no item matching your search.
                  </Typography>
                </Grid>
              ) : (
                product?.products?.map((item, index) => {
                  const productComments = comment.filter(
                    (x) => x.product_id === item.id
                  );

                  const averageRating = productComments.length
                    ? (
                        productComments.reduce(
                          (acc, cmt) => acc + cmt.rating,
                          0
                        ) / productComments.length
                      ).toFixed(1)
                    : 0;

                  const fullStars = Math.floor(averageRating);
                  const halfStar = averageRating - fullStars >= 0.5;
                  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                      key={index}
                      sx={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <Tooltip
                        title={item.name}
                        enterDelay={500}
                        leaveDelay={50}
                        placement="right-start"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 250 }}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "white",
                              boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                              color: "black",
                              borderRadius: "8px",
                              border: "1px solid black",
                              fontSize: "12px",
                            },
                          },
                        }}
                      >
                        <Card
                          sx={{
                            cursor: "pointer",
                            minWidth: 180,
                            padding: 2,
                            flexGrow: 1,
                            border: "1px solid #f5f7fd",
                            borderRadius: "16px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            backgroundColor: "white",
                            transition: "border 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              border: "1px solid #ff469e",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              item.image_url.includes("Product_")
                                ? `https://swp-be.onrender.com/mamababy/products/images/${item.image_url}`
                                : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                            }
                            onError={(e) => {
                              e.target.src =
                                "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                            }}
                            alt={item.name}
                            sx={{
                              width: "64px",
                              height: "64px",
                              margin: "auto",
                            }}
                            onClick={() =>
                              navigate(
                                `/products/${item.name
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}`,
                                { state: { productId: item.id } },
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                })
                              )
                            }
                          />
                          <CardContent
                            onClick={() =>
                              navigate(
                                `/products/${item.name
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}`,
                                { state: { productId: item.id } },
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                })
                              )
                            }
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                                marginTop: "0.75rem",
                                textAlign: "left",
                                whiteSpace: "normal",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                maxWidth: "100%",
                                lineHeight: "1.2rem",
                                maxHeight: "2.4rem",
                              }}
                            >
                              {item.name.length > 40
                                ? `${item.name.substring(0, 40)}...`
                                : item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "gray", textAlign: "left" }}
                            >
                              {formatCurrency(item.price)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "gray", textAlign: "left" }}
                            >
                              {brandMap[item.brand_id]} |{" "}
                              {categoryMap[item.category_id]}
                            </Typography>
                            {(item.status === "COMING SOON" ||
                              item.status === "OUT OF STOCK") && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#ff469e",
                                  textAlign: "right",
                                  opacity: 0.9,
                                  mt: 0.5,
                                }}
                              >
                                ({item.status})
                              </Typography>
                            )}
                          </CardContent>
                          <Divider />
                          <CardActions sx={{ justifyContent: "space-between" }}>
                            <Typography
                              variant="h6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {Array(fullStars).fill(
                                <Star style={{ color: "#ff469e" }} />
                              )}
                              {halfStar && (
                                <StarHalf style={{ color: "#ff469e" }} />
                              )}
                              {Array(emptyStars).fill(
                                <StarOutline style={{ color: "#ff469e" }} />
                              )}
                              <span
                                style={{
                                  color: "gray",
                                  fontSize: "0.8em",
                                  marginLeft: "4px",
                                }}
                              >
                                (
                                {
                                  comment.filter(
                                    (x) => x.product_id === item.id
                                  ).length
                                }
                                )
                              </span>
                            </Typography>
                            {/* {item.status !== "OUT OF STOCK" && (
                            <IconButton
                              size="large"
                              sx={{
                                transition:
                                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1.5,
                              }}
                              onClick={() => handleAddToCart(index)}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  width: "2px",
                                  height: "2px",
                                  fontSize: "22px",
                                  color: "inherit",
                                  top: "0",
                                  right: 10,
                                  fontWeight: 700,
                                }}
                              >
                                {" "}
                                +
                              </span>
                              <Cart />
                            </IconButton>
                            )} */}
                          </CardActions>
                        </Card>
                      </Tooltip>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={product.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton={product.totalPages !== 1}
            showLastButton={product.totalPages !== 1}
            hidePrevButton={currentPage === 1}
            hideNextButton={currentPage === product.totalPages}
            size="large"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
              width: "70%",
              p: 1,
              opacity: 0.9,
              borderRadius: "20px",
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                borderRadius: "20px",
                border: "1px solid black",
                boxShadow: "0px 2px 3px rgba(0, 0, 0.16, 0.5)",
                mx: 1,
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                },
                fontSize: "1.25rem",
              },
              "& .MuiPaginationItem-ellipsis": {
                mt: 1.25,
                fontSize: "1.25rem",
              },
            }}
            componentsProps={{
              previous: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
              next: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
            }}
          />
        </Box>
        {visible && (
          <IconButton
            size="large"
            sx={{
              position: "fixed",
              right: 25,
              bottom: 25,
              border: "1px solid #ff469e",
              backgroundColor: "#fff4fc",
              color: "#ff469e",
              transition:
                "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#ff469e",
                color: "white",
              },
            }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <KeyboardCapslock />
          </IconButton>
        )}
      </Container>
    </div>
  );
}
