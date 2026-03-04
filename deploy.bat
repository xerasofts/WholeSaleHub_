@echo off
REM GitHub Pages Deployment Script for Windows
REM Install gh-pages first: npm install --save-dev gh-pages

echo.
echo ========================================
echo  Wholesale Hub - GitHub Pages Deploy
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    call npm install --save-dev gh-pages
    echo.
)

REM Build the project
echo Building project...
call npm run build
echo Build completed!
echo.

REM Deploy
echo Deploying to GitHub Pages...
call npm run deploy
echo.
echo ========================================
echo  Deployment Complete! 🚀
echo ========================================
echo.
echo Your site should be live at:
echo https://xerasofts.github.io/WholeSaleHub_
echo.
echo Note: It may take a few minutes to appear.
echo Check your GitHub repository's Actions tab for status.
echo.
pause
