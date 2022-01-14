import App from 'next/app';
import Layout from '../components/Layout/Layout';
import 'semantic-ui-css/semantic.min.css';
import { parseCookies, destroyCookie } from 'nookies';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { redirectUser } from '../utils/authUser';
class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		// console.log(ctx, 'context');
		// parseCookies ini akan nyari object cookie didalam context yang isinya token jwt
		const { token } = parseCookies(ctx);
		// console.log(token, 'tokens di apps');
		let pageProps = {};
		const protectedRoutes = ctx.pathname === '/';
		//kalau ngga ada token tapi dia nyoba akses home atau url /, maka tendang balik ke login
		if (!token) {
			protectedRoutes && redirectUser(ctx, '/login');
		} else {
			//jika ada token
			if (Component.getInitialProps) {
				pageProps = await Component.getInitialProps(ctx);
			}
			console.log(pageProps, 'pageprops');

      // get data dengan mengirimkan token headers authorizations untuk diverifikasi di server
			try {
				const res = await axios.get(`${baseUrl}/api/auth`, {
					headers: { Authorization: token },
				});
				// console.log(res, 'res');
				const { user, userFollowStats } = res.data;

        //jika dia sudah login tapi mau balik lagi ke login/signup, tendang balik ke home /
				if (user) !protectedRoutes && redirectUser(ctx, '/');

				pageProps.user = user;
				pageProps.userFollowStats = userFollowStats;
			} catch (error) {
				console.log(error);
        // jika ada error, hapus cookie dan redirect balik ke login
				destroyCookie(ctx, 'token');
				redirectUser(ctx, '/login');
			}
		}

		return { pageProps };
	}
	render() {
		const { Component, pageProps } = this.props;

		return (
			<Layout {...pageProps}>
				<Component {...pageProps} />
			</Layout>
		);
	}
}

export default MyApp;
