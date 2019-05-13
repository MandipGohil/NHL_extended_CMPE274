import sys
from sklearn.externals import joblib

logreg = joblib.load('../Model/nhl.logistic_model.joblib')

x = [0]*64
home = int(sys.argv[1])
away = int(sys.argv[2])

if home < 11:
    x[home-1] = 1
elif home < 31:
    x[home-2] = 1
else:
    x[home-23] = 1

if away < 11:
    x[away+31] = 1
elif away < 31:
    x[away+30] = 1
else:
    x[away+9] = 1

print(logreg.predict([x])[0])
