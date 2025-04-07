import { useSelector } from "react-redux";
import Spinner from "../../components/common/Spinner";
import AppRouter from "../../Router/AppRouter";

const AppWrapper = () => {
  const isLoading = useSelector((state) => state.loader.loading);

  return (
    <>
        
        {isLoading && <Spinner />}
        <AppRouter />
    </>
  )
}

export default AppWrapper;